import { Stack, alpha, Skeleton, StackProps } from '@mui/material';

export function MailNavItemSkeleton({ sx, ...other }: StackProps) {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        py: 1,
        color: (theme) => alpha(theme.palette.grey[500], 0.24),
        ...sx,
      }}
      {...other}
    >
      <Skeleton variant="circular" sx={{ width: 32, height: 32, bgcolor: 'currentcolor' }} />

      <Skeleton sx={{ width: 0.5, height: 10, bgcolor: 'currentcolor' }} />
    </Stack>
  );
}

export function MailItemSkeleton({ sx, ...other }: StackProps) {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        py: 1,
        ...sx,
      }}
      {...other}
    >
      <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />

      <Stack spacing={1} flexGrow={1}>
        <Skeleton sx={{ width: 0.75, height: 10 }} />
        <Skeleton sx={{ width: 0.5, height: 10 }} />
      </Stack>
    </Stack>
  );
}
