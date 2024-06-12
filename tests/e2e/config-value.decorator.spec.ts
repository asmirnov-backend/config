import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService, ConfigValue } from '../../lib';
import { Injectable } from '@nestjs/common';
import { AppModule } from '../src/app.module';

@Injectable()
class WithOneArgumentService {
  @ConfigValue('PORT')
  port!: string;
}

const portDefaultValue = '9876';

@Injectable()
class WithTwoArgumentService {
  @ConfigValue('Not existing env name', portDefaultValue)
  port!: string;
}

@Injectable()
class WithAnotherConfigInjectedService {
  @ConfigValue('PORT', portDefaultValue)
  port!: string;

  constructor(private readonly configService: ConfigService) {}
}

describe('ConfigValue property decorator', () => {
  describe('Decorator applied with one argument', () => {
    let service: WithOneArgumentService;
    let config: ConfigService;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        providers: [WithOneArgumentService],
        imports: [AppModule.withEnvVars()],
      }).compile();

      const app = moduleFixture.createNestApplication();
      await app.init();

      service = app.get(WithOneArgumentService);
      config = app.get(ConfigService);
    });

    it('Nest started correctly', () => {
      expect(service).toBeDefined();
    });

    it('Value is defined', () => {
      expect(service.port).toBeDefined();
    });

    it('Value from decorator is the same as from ConfigService', () => {
      expect(service.port).toBe(config.get('PORT'));
    });

    it('Throw error when using setter', () => {
      expect(() => (service.port = '1233')).toThrow();
    });
  });

  describe('Decorator applied with two argument', () => {
    let service: WithTwoArgumentService;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        providers: [WithTwoArgumentService],
        imports: [AppModule.withEnvVars()],
      }).compile();

      const app = moduleFixture.createNestApplication();
      await app.init();

      service = app.get(WithTwoArgumentService);
    });

    it('Nest started correctly', () => {
      expect(service).toBeDefined();
    });

    it('Value is defined', () => {
      expect(service.port).toBeDefined();
    });

    it('Value from decorator is default value', () => {
      expect(service.port).toBe(portDefaultValue);
    });
  });

  describe('WithAnotherConfigInjectedService', () => {
    let service: WithAnotherConfigInjectedService;
    let config: ConfigService;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        providers: [WithAnotherConfigInjectedService],
        imports: [ConfigModule.forRoot({ envFilePath: '.env.valid' })],
      }).compile();

      const app = moduleFixture.createNestApplication();
      await app.init();

      service = app.get(WithAnotherConfigInjectedService);
      config = app.get(ConfigService);
    });

    it('Nest started correctly', () => {
      expect(service).toBeDefined();
    });

    it('Value is defined', () => {
      expect(service.port).toBeDefined();
    });

    it('Value from decorator is the same as from ConfigService', () => {
      expect(service.port).toBe(config.get('PORT'));
    });

    it('Injected ConfigService exists', () => {
      expect(service['configService']).toBe(config);
    });
  });
});
