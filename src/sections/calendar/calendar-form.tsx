import * as Yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { Box, Stack, Button, Tooltip, IconButton, DialogActions } from '@mui/material';

import uuidv4 from 'src/utils/uuidv4';
import { isAfter, fTimestamp } from 'src/utils/format-time';

import { createEvent, deleteEvent, updateEvent } from 'src/api/calendar';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider from 'src/components/hook-form/form-provider';

import { ICalendarDate, ICalendarEvent } from 'src/types/calendar';

type Props = {
  colorOptions: string[];
  onClose: VoidFunction;
  currentEvent?: ICalendarEvent;
};

export default function CalendarForm({ currentEvent, colorOptions, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000, 'Description must be at most 5000 characters'),
    // not required
    color: Yup.string(),
    allDay: Yup.boolean(),
    start: Yup.mixed(),
    end: Yup.mixed(),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = isAfter(values.start, values.end);

  const onSubmit = handleSubmit(async (data) => {
    const eventData: ICalendarEvent = {
      id: currentEvent?.id ? currentEvent?.id : uuidv4(),
      color: data?.color,
      title: data?.title,
      allDay: data?.allDay,
      description: data?.description,
      end: data?.end,
      start: data?.start,
    } as ICalendarEvent;

    try {
      if (!dateError) {
        if (currentEvent?.id) {
          await updateEvent(eventData);
          enqueueSnackbar('Update success!');
        } else {
          await createEvent(eventData);
          enqueueSnackbar('Create success!');
        }
        onClose();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await deleteEvent(`${currentEvent?.id}`);
      enqueueSnackbar('Delete success!');
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [currentEvent?.id, enqueueSnackbar, onClose]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="title" label="Title" />

        <RHFTextField name="description" label="Description" multiline rows={3} />

        <RHFTextField name="addDay" label="All day" />

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="Start date"
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="End date"
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError,
                  helperText: dateError && 'End date must be later than start date',
                },
              }}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              selected={field.value as string}
              onSelectColor={(color) => field.onChange(color as string)}
              colors={colorOptions}
            />
          )}
        />
      </Stack>

      <DialogActions>
        {!!currentEvent?.id && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cance
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
