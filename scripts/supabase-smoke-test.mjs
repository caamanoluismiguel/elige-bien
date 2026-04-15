// Smoke test for Supabase elige-bien-MX connection.
// Usage: node --env-file=.env.local scripts/supabase-smoke-test.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error("✗ Missing env vars. Check .env.local");
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("→ Connecting to", url);

const testLead = {
  email: "smoke-test@example.com",
  name: "Smoke Test",
  phone: "+521234567890",
  grade: "prepa_3",
  source: "smoke-test",
  consent_marketing: false,
  test1_result: { profile: "analitica", scores: { analitica: 5 } },
};

console.log("→ Inserting test lead...");
const { data: inserted, error: insertError } = await supabase
  .from("leads")
  .insert(testLead)
  .select()
  .single();

if (insertError) {
  console.error("✗ Insert failed:", insertError.message);
  process.exit(1);
}
console.log("✓ Inserted lead id:", inserted.id);

console.log("→ Reading test lead...");
const { data: read, error: readError } = await supabase
  .from("leads")
  .select("id, email, grade, test1_result")
  .eq("id", inserted.id)
  .single();

if (readError) {
  console.error("✗ Read failed:", readError.message);
  process.exit(1);
}
console.log("✓ Read lead:", read);

console.log("→ Deleting test lead...");
const { error: deleteError } = await supabase
  .from("leads")
  .delete()
  .eq("id", inserted.id);

if (deleteError) {
  console.error("✗ Delete failed:", deleteError.message);
  process.exit(1);
}
console.log("✓ Deleted");

console.log("\n✓ All Supabase operations working.");
