import { orderBy } from 'lodash';
import { useCallback } from 'react';

import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Badge,
  Stack,
  Drawer,
  Divider,
  Tooltip,
  IconButton,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ColorPicker } from 'src/components/color-utils';

import { ICalendarEvent, ICalendarFilters, ICalendarFilterValue } from 'src/types/calendar';

type Props = {
  filters: ICalendarFilters;
  onFilters: (name: string, value: ICalendarFilterValue) => void;
  canReset: boolean;
  onResetFilters: VoidFunction;
  dateError: boolean;
  open: boolean;
  onClose: VoidFunction;
  events: ICalendarEvent[];
  colorOptions: string[];
  onClickEvent: (eventId: string) => void;
};

export default function CalendarFilters({
  open,
  onClose,
  filters,
  onFilters,
  canReset,
  onResetFilters,
  dateError,
  events,
  colorOptions,
  onClickEvent,
}: Props) {
  const handleFilterColors = useCallback(
    (newValue: string | string[]) => {
      onFilters('colors', newValue as string[]);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        py: 2,
        pr: 1,
        pl: 2.5,
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderColors = (
    <Stack spacing={1} sx={{ my: 3, px: 2.5 }}>
      <Typography variant="subtitle2">Colors</Typography>

      <ColorPicker
        colors={colorOptions}
        selected={filters.colors}
        onSelectColor={handleFilterColors}
      />
    </Stack>
  );

  const renderDateRange = (
    <Stack spacing={1.5} sx={{ mb: 3, px: 2.5 }}>
      <Typography variant="subtitle2">Range</Typography>

      <Stack spacing={2}>
        <DatePicker label="Start date" value={filters.startDate} onChange={handleFilterStartDate} />

        <DatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError && 'End date must be later than start date',
            },
          }}
        />
      </Stack>
    </Stack>
  );

  const renderEvents = (
    <>
      <Typography variant="subtitle2" sx={{ px: 2.5, mb: 1 }}>
        Events ({events.length})
      </Typography>

      <Scrollbar sx={{ height: 1 }}>
        {orderBy(events, ['end'], ['desc']).map((event) => (
          <ListItemButton
            key={event.id}
            onClick={() => onClickEvent(`${event.id}`)}
            sx={{
              py: 1.5,
              borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                top: 16,
                left: 0,
                width: 0,
                height: 0,
                position: 'absolute',
                borderRight: '10px solid transparent',
                borderTop: `10px solid ${event.color}`,
              }}
            />

            <ListItemText
              disableTypography
              primary={
                <Typography variant="subtitle2" sx={{ fontSize: 13, mt: 0.5 }}>
                  {event.title}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ fontSize: 11, color: 'text.disabled' }}
                >
                  {event.allDay ? (
                    fDateTime(event.start, 'dd MMM yy')
                  ) : (
                    <>
                      {`${fDateTime(event.start, 'dd MMM yy p')} - ${fDateTime(
                        event.end,
                        'dd MMM yy p'
                      )}`}
                    </>
                  )}
                </Typography>
              }
              sx={{ display: 'flex', flexDirection: 'column-reverse' }}
            />
          </ListItemButton>
        ))}
      </Scrollbar>
    </>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      {renderHead}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderColors}

      {renderDateRange}

      {renderEvents}
    </Drawer>
  );
}
