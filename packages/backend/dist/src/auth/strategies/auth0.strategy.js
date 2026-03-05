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
exports.Auth0Strategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_auth0_1 = require("passport-auth0");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
let Auth0Strategy = class Auth0Strategy extends (0, passport_1.PassportStrategy)(passport_auth0_1.Strategy, 'auth0') {
    constructor(configService, authService) {
        console.log('Initializing Auth0Strategy...');
        const domain = configService.get('AUTH0_DOMAIN');
        const clientID = configService.get('AUTH0_CLIENT_ID');
        console.log('Auth0 Domain:', domain);
        console.log('Auth0 ClientID:', clientID);
        super({
            domain,
            clientID,
            clientSecret: configService.get('AUTH0_CLIENT_SECRET'),
            callbackURL: configService.get('AUTH0_CALLBACK_URL'),
            scope: 'openid profile email',
            state: true,
        });
        this.authService = authService;
        console.log('Auth0Strategy initialized successfully.');
    }
    async validate(accessToken, refreshToken, profile) {
        return this.authService.validateUser(profile);
    }
};
exports.Auth0Strategy = Auth0Strategy;
exports.Auth0Strategy = Auth0Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], Auth0Strategy);
//# sourceMappingURL=auth0.strategy.js.map