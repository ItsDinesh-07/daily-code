import React from 'react';
import { Skeleton, SkeletonProps } from '@mui/material';

export const ShimmerSkeleton: React.FC<SkeletonProps> = (props) => {
  return (
    <Skeleton
      animation="wave"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        ...props.style,
      }}
      {...props}
    />
  );
};
