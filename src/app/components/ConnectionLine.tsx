interface ConnectionLineProps {
  type?: 'vertical' | 'horizontal' | 'arrow-right';
  color?: string;
  thickness?: number;
}

export function ConnectionLine({ 
  type = 'vertical', 
  color = '#cbd5e1',
  thickness = 2
}: ConnectionLineProps) {
  if (type === 'vertical') {
    return (
      <div className="flex justify-center py-1">
        <div 
          className="rounded-full" 
          style={{ 
            width: `${thickness}px`,
            height: '48px',
            backgroundColor: color 
          }}
        />
      </div>
    );
  }

  if (type === 'horizontal') {
    return (
      <div className="flex items-center px-1">
        <div 
          className="rounded-full flex-1" 
          style={{ 
            height: `${thickness}px`,
            backgroundColor: color 
          }}
        />
      </div>
    );
  }

  if (type === 'arrow-right') {
    return (
      <div className="flex items-center justify-center px-4">
        <div className="relative flex items-center">
          <div 
            className="rounded-full" 
            style={{ 
              width: '100px',
              height: `${thickness}px`,
              backgroundColor: color 
            }}
          />
          <div 
            className="absolute right-0"
            style={{
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: `10px solid ${color}`
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}
