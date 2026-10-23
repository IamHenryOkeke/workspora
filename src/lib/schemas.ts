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

export const signUpSchema = z
  .object({
    fullName: z
      .string({ error: 'Name is required' })
      .min(3, { error: 'Name must be at least 3 characters long' })
      .trim(),
    email: z.string().trim().toLowerCase().optional(),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        error: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        error: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { error: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        error: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string(),
    inviteToken: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
    if (!data.inviteToken && !z.email().safeParse(data.email).success) {
      ctx.addIssue({
        code: 'custom',
        message: 'Email must be valid',
        path: ['email'],
      });
    }
  });

export const logInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(3, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        error: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        error: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { error: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        error: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

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

export const editMemberSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
});

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Organization name must be at least 2 characters')
    .max(60, 'Organization name must be 60 characters or fewer'),
  description: z
    .string()
    .trim()
    .max(200, 'Description must be 200 characters or fewer'),
  logo: z
    .instanceof(File)
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      'Logo must be a PNG or JPG',
    )
    .refine((f) => f.size <= MAX_FILE_SIZE, 'Logo must be 2MB or smaller')
    .optional(),
});

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(255),
  phoneNumber: z
    .string()
    .trim()
    .max(20, 'Phone number is too long')
    .regex(/^\+?[0-9\s().-]*$/, 'Enter a valid phone number')
    .optional(),
  avatar: z
    .instanceof(File)
    .refine(
      (f) => ['image/png', 'image/jpeg'].includes(f.type),
      'Avatar must be a PNG or JPG',
    )
    .refine((f) => f.size <= MAX_FILE_SIZE, 'Avatar must be 2MB or smaller')
    .optional(),
});

export const getChangePasswordSchema = (hasPassword: boolean) =>
  z
    .object({
      currentPassword: hasPassword
        ? z.string().min(1, 'Enter your current password')
        : z.string().optional(),
      newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password must be 72 characters or fewer'), // bcrypt ignores anything past 72 bytes
      confirmPassword: z.string().min(1, 'Confirm your new password'),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    })
    .refine((d) => !hasPassword || d.newPassword !== d.currentPassword, {
      path: ['newPassword'],
      message: 'New password must be different from the current one',
    });
