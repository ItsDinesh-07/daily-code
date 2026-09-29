import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: string;
  conclusion?: string | null;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, conclusion, ...props }) => {
  let label = status;
  let color: 'success' | 'error' | 'warning' | 'default' | 'info' = 'default';
  let icon = <RemoveCircleOutlineIcon fontSize="small" />;
  let customStyle = {};

  if (status === 'in_progress' || status === 'queued') {
    label = 'Running';
    color = 'info';
    icon = <AutorenewIcon fontSize="small" style={{ animation: 'spin 2s linear infinite' }} />;
    customStyle = {
      backgroundColor: 'rgba(6, 182, 212, 0.15)',
      color: '#22d3ee',
      border: '1px solid rgba(6, 182, 212, 0.3)',
    };
  } else if (conclusion === 'success') {
    label = 'Success';
    color = 'success';
    icon = <CheckCircleOutlineIcon fontSize="small" />;
    customStyle = {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    };
  } else if (conclusion === 'failure' || conclusion === 'timed_out') {
    label = 'Failed';
    color = 'error';
    icon = <ErrorOutlineIcon fontSize="small" />;
    customStyle = {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    };
  } else if (conclusion === 'skipped' || conclusion === 'cancelled') {
    label = conclusion.charAt(0).toUpperCase() + conclusion.slice(1);
    color = 'default';
    customStyle = {
      backgroundColor: 'rgba(148, 163, 184, 0.15)',
      color: '#94a3b8',
      border: '1px solid rgba(148, 163, 184, 0.3)',
    };
  }

  return (
    <Chip
      size="small"
      icon={icon}
      label={label}
      style={{
        fontWeight: 600,
        fontSize: '0.75rem',
        height: '24px',
        ...customStyle,
      }}
      {...props}
    />
  );
};
