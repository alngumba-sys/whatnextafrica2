import { useState, useEffect } from 'react';
import { supabase, UploadedImage } from '@/lib/supabase';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Upload, Trash2, Image as ImageIcon, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function ImageManagement() {
  const { user } = useAuth();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState('');
  const [imageType, setImageType] = useState<'logo' | 'icon' | 'banner' | 'other'>('logo');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      // Load from Supabase
      const { data, error } = await supabase
        .from('uploaded_images')
        .select('*')
        .order('uploadedAt', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setImages(data);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      setUploadStatus({ type: 'error', message: 'Failed to load images' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setUploadStatus({ type: 'error', message: 'Please select an image file' });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus({ type: 'error', message: 'File size must be less than 5MB' });
        return;
      }
      
      setSelectedFile(file);
      setImageName(file.name.split('.')[0]);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !imageName || !user) {
      setUploadStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${imageName.replace(/\s+/g, '_')}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('platform-assets')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('platform-assets')
        .getPublicUrl(filePath);

      // Save metadata to database
      const newImage: Omit<UploadedImage, 'id'> = {
        name: imageName,
        url: publicUrl,
        type: imageType,
        uploadedBy: user.name,
        uploadedAt: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('uploaded_images')
        .insert([newImage]);

      if (dbError) throw dbError;

      setUploadStatus({ type: 'success', message: 'Image uploaded successfully!' });
      setSelectedFile(null);
      setImageName('');
      setImageType('logo');
      
      // Reload images
      await loadImages();
      
      // Clear file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Failed to upload image. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const filePath = `images/${urlParts[urlParts.length - 1]}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('platform-assets')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setUploadStatus({ type: 'success', message: 'Image deleted successfully!' });
      await loadImages();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Failed to delete image' 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6 bg-[#F5F5DC] border-[#66023C]/20">
        <h2 className="text-xl font-bold text-[#66023C] mb-4">Upload New Image</h2>
        
        <div className="space-y-4">
          {/* File Input */}
          <div>
            <Label htmlFor="file-input" className="text-gray-700">Select Image</Label>
            <div className="mt-2">
              <Input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Image Name */}
          <div>
            <Label htmlFor="image-name" className="text-gray-700">Image Name</Label>
            <Input
              id="image-name"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="e.g., Ministry Logo"
              className="mt-2"
            />
          </div>

          {/* Image Type */}
          <div>
            <Label htmlFor="image-type" className="text-gray-700">Image Type</Label>
            <Select value={imageType} onValueChange={(value: any) => setImageType(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logo">Logo</SelectItem>
                <SelectItem value="icon">Icon</SelectItem>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <div className={`flex items-center gap-2 p-3 rounded ${
              uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {uploadStatus.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span className="text-sm">{uploadStatus.message}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !imageName || uploading}
            className="w-full bg-[#66023C] hover:bg-[#66023C]/90 text-white"
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Images Gallery */}
      <Card className="p-6 bg-white border-[#66023C]/20">
        <h2 className="text-xl font-bold text-[#66023C] mb-4">Uploaded Images</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No images uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#66023C]/50 transition-colors">
                <div className="aspect-video bg-gray-100 rounded mb-3 overflow-hidden flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{image.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="px-2 py-1 bg-[#F5F5DC] text-[#66023C] rounded text-xs">
                      {image.type}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(image.id, image.url)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>By: {image.uploadedBy}</p>
                    <p>{new Date(image.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="pt-2">
                    <Input
                      value={image.url}
                      readOnly
                      className="text-xs"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <p className="text-xs text-gray-400 mt-1">Click to copy URL</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-white border-[#66023C]/20">
        <h3 className="font-semibold text-[#66023C] mb-2">Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Upload images up to 5MB in size</li>
          <li>• Supported formats: JPG, PNG, SVG, WebP, GIF</li>
          <li>• After uploading, copy the image URL to use it in the platform</li>
          <li>• Images are stored permanently and accessible via public URLs</li>
        </ul>
      </Card>
    </div>
  );
}
