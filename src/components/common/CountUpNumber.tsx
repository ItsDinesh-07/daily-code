import React, { useEffect, useState } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface CountUpNumberProps extends TypographyProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  duration = 1000,
  suffix = '',
  prefix = '',
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easedProgress * (endValue - startValue) + startValue);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <Typography
      style={{ fontVariantNumeric: 'tabular-nums' }}
      {...props}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </Typography>
  );
};
