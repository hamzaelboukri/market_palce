"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0UserInfoStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_http_bearer_1 = require("passport-http-bearer");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../../users/users.service");
let Auth0UserInfoStrategy = class Auth0UserInfoStrategy extends (0, passport_1.PassportStrategy)(passport_http_bearer_1.Strategy, 'jwt') {
    constructor(configService, usersService) {
        super();
        this.usersService = usersService;
        this.auth0Domain = configService.get('AUTH0_DOMAIN', '');
    }
    async validate(token) {
        if (!token?.trim()) {
            throw new common_1.UnauthorizedException('Missing token');
        }
        if (!this.auth0Domain) {
            throw new common_1.UnauthorizedException('Auth0 not configured');
        }
        const res = await fetch(`https://${this.auth0Domain}/userinfo`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const profile = await res.json();
        const auth0Id = profile.sub;
        let user = await this.usersService.findByAuth0Id(auth0Id);
        if (!user) {
            user = await this.usersService.create({
                email: profile.email ?? `${auth0Id.replace('|', '-')}@auth0.user`,
                name: profile.name ?? profile.nickname ?? null,
                avatar: profile.picture ?? null,
                auth0Id,
            });
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
};
exports.Auth0UserInfoStrategy = Auth0UserInfoStrategy;
exports.Auth0UserInfoStrategy = Auth0UserInfoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], Auth0UserInfoStrategy);
//# sourceMappingURL=auth0-userinfo.strategy.js.map