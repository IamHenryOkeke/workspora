import { z } from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const toFileArray = (files: unknown): File[] => {
  if (files == null) return [];
  if (typeof FileList !== 'undefined' && files instanceof FileList) {
    return Array.from(files);
  }
  if (Array.isArray(files)) return files as File[];
  if (typeof (files as ArrayLike<unknown>).length === 'number') {
    return Array.from(files as ArrayLike<File>);
  }
  return [];
};

const requiredImageFile = z
  .custom<FileList>()
  .refine((files) => toFileArray(files).length === 1, 'File is required')
  .refine(
    (files) => (toFileArray(files)[0]?.size ?? Infinity) <= MAX_FILE_SIZE,
    'Max file size is 1MB',
  )
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(toFileArray(files)[0]?.type),
    'Only .jpg, .png, and .webp formats are supported',
  );

export const createOrganisationSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(3, { error: 'Name must be at least 3 characters long' }),
  logo: requiredImageFile,
  description: z
    .string({ error: 'Description is required' })
    .min(10, { error: 'Description must be at least 10 characters long' }),
});

export const createProjectSchema = z.object({
  name: z
    .string({ error: 'Project name is required' })
    .trim()
    .min(3, 'Project name should be at least 3 characters'),
  description: z
    .string({ error: 'Project description is required' })
    .trim()
    .min(1, 'Project description is required'),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z
    .enum(['PENDING', 'COMPLETED', 'ACTIVE', 'ARCHIVED'], {
      error: 'Please enter a valid status value',
    })
    .optional(),
});

export const inviteMemberSchema = z.object({
  email: z.email({ error: 'Must be a valid email address' }).trim(),
  role: z.enum(['ADMIN', 'MEMBER'], {
    error: 'Please enter a valid role value',
  }),
});
