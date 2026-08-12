'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

const createOrganisationSchema = z.object({
  name: z.string().min(6, 'Organisation name must be at least 6 characters'),
});

type CreateOrganisationData = z.infer<typeof createOrganisationSchema>;

const createOrganisation = async (data: CreateOrganisationData) => {
  const res = await axios.post('/api/dashboard/organizations', data);
  return res.data;
};

export default function CreateOrganizationForm() {
  const router = useRouter();
  const { handleSubmit, control } = useForm<CreateOrganisationData>({
    resolver: zodResolver(createOrganisationSchema),
    defaultValues: {
      name: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createOrganisation,
    onSuccess: () => {
      router.push('/app/home');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        error.response?.data?.error ||
          'An error occurred during organisation creation',
      );
    },
  });

  const onSubmit = (data: CreateOrganisationData) => mutate(data);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Organisation</CardTitle>
        <CardDescription>
          Enter your organisation name below to create your organisation
        </CardDescription>
        <CardAction>
          <Button variant="link" asChild onClick={() => router.back()}>
            Go back
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="create-organisation-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Organisation Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Acme Inc."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="create-organisation-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create Organisation'}
        </Button>
      </CardFooter>
    </Card>
  );
}
