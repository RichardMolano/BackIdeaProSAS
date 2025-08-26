import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "please_change_me",
    });
  }

  async validate(payload: any) {
    // We can fetch user info if needed; keep payload minimal
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
