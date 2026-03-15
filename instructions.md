Before implementing this phase, carefully read the PRD, the phase documentation, and PROJECT_CONTEXT.md to fully understand the current project state.

Follow the instructions below strictly while implementing this phase.

--------------------------------------------------

IMPLEMENTATION RULES

1. Do not skip or ignore any implementation described in the phase documentation.

2. Implement every component required in this phase, including:
   - frontend code
   - backend APIs
   - database schema
   - integrations
   - documentation updates

3. Maintain the folder hierarchy defined in the project architecture.

Frontend code must always remain inside the frontend folder.

Backend code must always remain inside the backend folder.

--------------------------------------------------

DATABASE AND SUPABASE RULES

4. If the phase requires database tables, indexes, or schema changes, create them directly in Supabase.

5. The MCP server connection to Supabase is already established, so you may execute the required SQL commands when necessary.

6. Before executing SQL statements:
   - verify table structure
   - check column types
   - confirm relationships and foreign keys

7. After executing SQL queries:
   - verify that the tables were created correctly
   - confirm indexes and constraints exist
   - ensure queries run without errors

--------------------------------------------------

ENVIRONMENT AND SECURITY RULES

8. Always use environment variables from the .env file for credentials and secrets.

Never hardcode credentials inside the source code.

9. If any credentials are required and not available in the .env file, ask the user before continuing.

--------------------------------------------------

IMPLEMENTATION VALIDATION RULES

10. After implementing the phase, validate the system end-to-end.

Check the following:

- frontend pages render correctly
- APIs respond correctly
- database queries execute successfully
- Supabase connection works
- data is saved and retrieved correctly

11. If any feature is not working:

- debug the issue
- identify the root cause
- fix the implementation
- re-test until the functionality works correctly

--------------------------------------------------

INTEGRATION VALIDATION

12. Confirm that the frontend correctly communicates with backend APIs.

13. Confirm backend APIs correctly interact with the database.

14. Verify that data flows correctly from frontend → backend → database → backend → frontend.

--------------------------------------------------

CODE QUALITY RULES

15. Write clean, modular, and maintainable code.

16. Avoid duplication and reuse existing components where possible.

17. Follow the UI_UX_Guidelines.md for all frontend components.

--------------------------------------------------

PROJECT CONTEXT UPDATE

18. After the phase is successfully implemented, immediately update PROJECT_CONTEXT.md.

The update must include:

- phase number and name
- summary of implemented features
- frontend components created
- backend APIs created
- database tables added or modified
- integrations implemented
- any configuration changes

This ensures future AI sessions or IDE environments can continue development without losing context.

--------------------------------------------------

FINAL VERIFICATION

Before marking the phase as complete:

- confirm all features in the phase are implemented
- confirm frontend, backend, and database are connected
- confirm there are no unresolved errors
- confirm PROJECT_CONTEXT.md has been updated

Only after all validations pass should the phase be considered complete.

