# sloane13

Static SloaneX site for Vercel, including serverless functions for admin access
validation and support email delivery.

## Environment variables

Set the following variables in Vercel to enable email delivery:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SECURE` (`true` or `false`)
- `SUPPORT_FROM` (optional sender override)
- `ADMIN_CODE` (defaults to `420600` if unset)
