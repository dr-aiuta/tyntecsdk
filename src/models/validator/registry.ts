import {z} from 'zod';

/**
 * A singleton registry for managing Zod schemas.
 * This class provides a centralized way to store and retrieve Zod validation schemas.
 */
export class SchemaRegistry {
	private static instance: SchemaRegistry;
	private schemas: Map<string, z.ZodType>;

	private constructor() {
		this.schemas = new Map();
	}

	/**
	 * Gets the singleton instance of SchemaRegistry.
	 * @returns The singleton instance of SchemaRegistry
	 */
	public static getInstance(): SchemaRegistry {
		if (!SchemaRegistry.instance) {
			SchemaRegistry.instance = new SchemaRegistry();
		}
		return SchemaRegistry.instance;
	}

	/**
	 * Registers a new schema with the given name.
	 * @param name - The unique identifier for the schema
	 * @param schema - The Zod schema to register
	 */
	public registerSchema(name: string, schema: z.ZodType): void {
		this.schemas.set(name, schema);
	}

	/**
	 * Retrieves a schema by its name.
	 * @param name - The name of the schema to retrieve
	 * @returns The Zod schema
	 * @throws {Error} If the schema is not found
	 */
	public getSchema(name: string): z.ZodType {
		const schema = this.schemas.get(name);
		if (!schema) {
			throw new Error(`Schema not found: ${name}`);
		}
		return schema;
	}

	/**
	 * Returns a copy of all registered schemas.
	 * @returns A Map containing all registered schemas
	 */
	public getAllSchemas(): Map<string, z.ZodType> {
		return new Map(this.schemas);
	}

	/**
	 * Validates data against a registered schema.
	 * @param name - The name of the schema to use for validation
	 * @param data - The data to validate
	 * @returns The validated and typed data
	 * @throws {z.ZodError} If validation fails
	 */
	public validate<T>(name: string, data: unknown): T {
		const schema = this.getSchema(name);
		return schema.parse(data) as T;
	}

	/**
	 * Safely validates data against a registered schema without throwing errors.
	 * @param name - The name of the schema to use for validation
	 * @param data - The data to validate
	 * @returns An object containing the validation result and either the validated data or error
	 */
	public safeValidate<T>(name: string, data: unknown): {success: boolean; data?: T; error?: z.ZodError} {
		const schema = this.getSchema(name);
		const result = schema.safeParse(data);

		if (result.success) {
			return {success: true, data: result.data as T};
		}

		return {success: false, error: result.error};
	}
}

// Export singleton instance
export const schemaRegistry = SchemaRegistry.getInstance();

/**
 * Helper function to register multiple schemas at once.
 * @param schemas - Array of objects containing schema names and their corresponding Zod schemas
 */
export function registerSchemas(schemas: Array<{name: string; schema: z.ZodType}>) {
	schemas.forEach(({name, schema}) => {
		schemaRegistry.registerSchema(name, schema);
	});
}
