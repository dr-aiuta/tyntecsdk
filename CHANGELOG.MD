# Changelog

## [0.0.4] - 2025-05-03

### Breaking Changes

- Refactored `sendTemplateMessage` to accept a single `components` object (with header, body, button arrays) instead of separate body/button arrays.
- Updated all relevant TypeScript types and schemas for template and WhatsApp messages, including `TemplateComponents`.
- Updated tests to match new method signatures and validation logic.

### Added

- `sendWhatsAppMessage` method to validate and send any WhatsApp message object using a unified schema.
- Homepage field to `package.json`.

### Changed

- Improved Zod validation for WhatsApp message schemas, aligning field structure and optionality.
- Enhanced JSDoc comments for all client methods for better API documentation.
- Updated README with new usage examples, requirements, and error handling details.

---

## [0.0.3] - 2025-04-30

### Added

- Introduced Zod for runtime type validation and schema definitions.
- Implemented comprehensive WhatsApp message type validation (text, media, location, contacts, reactions, templates, interactive messages).
- Added new `sendWhatsAppMessage` method with schema validation.
- Created extensive test suite for `TyntecClient`.

### Changed

- Relaxed Node.js (>=20.0.0) and npm (>=10.0.0) version requirements.

---

## [0.0.2] - 2025-02-25

### Added

- Improved API response handling in `TyntecClient`.

### Changed

- Updated README with new/clarified documentation.

---

## [0.0.1] - Initial release

- Initial commit.

---
