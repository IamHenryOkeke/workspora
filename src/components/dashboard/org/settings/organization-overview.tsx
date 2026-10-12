'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Organization } from '@/lib/types';
import OrganizationLogo from '../../organization-logo';

const labelClass = 'text-xs uppercase tracking-wider text-muted-foreground';

export default function OrganizationOverview({
  organization,
}: {
  organization: Organization;
}) {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <section className="flex max-w-2xl flex-col gap-5 rounded-md border p-6">
      <h2 className={labelClass}>Organization</h2>

      <div className="flex items-center gap-4">
        <OrganizationLogo
          name={organization.name}
          logo={organization.logo}
          size={64}
        />
        <p className="text-xs text-muted-foreground">
          Only owners and admins can edit these details.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="overview-name" className={labelClass}>
          Organization name
        </FieldLabel>
        <Input id="overview-name" value={organization.name} readOnly />
      </Field>

      <Field>
        <FieldLabel htmlFor="overview-slug" className={labelClass}>
          URL handle
        </FieldLabel>
        <div className="flex items-stretch overflow-hidden rounded-md border">
          <span className="flex items-center bg-muted px-3 text-sm text-muted-foreground">
            {origin ? `${origin}/` : '/'}
          </span>
          <Input
            id="overview-slug"
            value={organization.slug}
            readOnly
            className="rounded-none border-0 focus-visible:ring-0"
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="overview-description" className={labelClass}>
          Description
        </FieldLabel>
        <Input
          id="overview-description"
          value={organization.description ?? ''}
          placeholder="No description"
          readOnly
        />
      </Field>
    </section>
  );
}
