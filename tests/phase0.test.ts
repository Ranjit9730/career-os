import { hashPassword, verifyPassword } from "../src/lib/auth/password"

console.assert(typeof hashPassword === "function")
console.log("Phase 0 test: password modules loaded.")
