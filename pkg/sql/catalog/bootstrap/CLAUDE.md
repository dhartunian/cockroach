# Bootstrap Package

This package defines the initial key-value pairs used to bootstrap a new
CockroachDB cluster's system schema.

## Updating Bootstrap Testdata

When the system schema changes (e.g., adding a new system table), the bootstrap
test `TestInitialValuesToString` will fail with a hash mismatch. The testdata
file uses hashes as a safety check — `--rewrite` only updates expected output
blocks, not the `hash=` arguments in the command lines.

### Update procedure

1. Run the test without `--rewrite` to get the new hash(es) from the error:
   ```bash
   ./dev test pkg/sql/catalog/bootstrap -v --timeout=300s
   ```
   Look for: `Unexpected hash value <NEW_HASH> for system.` (and/or `for tenant.`)

2. Manually update the hash(es) in `testdata/testdata`:
   - Line starting with `system hash=...`
   - Line starting with `tenant hash=...`

3. Run with `--rewrite` to regenerate the expected output:
   ```bash
   ./dev test pkg/sql/catalog/bootstrap -v --rewrite --timeout=300s
   ```

4. Verify it passes:
   ```bash
   ./dev test pkg/sql/catalog/bootstrap -v --timeout=300s
   ```

Both the system hash and tenant hash may need updating — fix the system hash
first, rerun to check if the tenant hash also changed, then update both.
