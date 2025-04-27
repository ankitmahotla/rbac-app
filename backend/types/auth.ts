export interface UserJwtPayload {
  id: string;
  role: string;
  iat?: number; // Issued at (auto-added by JWT)
  exp?: number; // Expiration (auto-added by JWT)
}
