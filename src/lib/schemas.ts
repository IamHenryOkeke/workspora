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
