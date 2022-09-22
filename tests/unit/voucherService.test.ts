import voucherService from "../../src/services/voucherService";
import voucherRepository from "../../src/repositories/voucherRepository";

import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

describe("voucher test unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  jest
    .spyOn(voucherRepository, "getVoucherByCode")
    .mockImplementationOnce(() => null);
  jest
    .spyOn(voucherRepository, "createVoucher")
    .mockImplementationOnce((code, discount) => {
      return null;
    });

  it("should create a voucher successfully", async () => {
    const voucher = {
      id: 2,
      code: faker.random.numeric(4),
      discount: faker.datatype.number({ min: 1, max: 100 }),
      used: false,
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(null);
    await voucherService.createVoucher(voucher.code, voucher.discount);
    expect(voucherRepository.createVoucher).toBeCalledTimes(1);
  });

  it("should try to create a voucher that already exists, returning conflict status error", async () => {
    const voucher = {
      id: 2,
      code: faker.random.numeric(4),
      discount: faker.datatype.number({ min: 1, max: 100 }),
      used: false,
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(voucher);
    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockResolvedValueOnce(voucher);
    await expect(
      voucherService.createVoucher(voucher.code, voucher.discount)
    ).rejects.toEqual({
      message: "Voucher already exist.",
      type: "conflict",
    });
  });

  it("should try to get a voucher that does not exist, returning conflict status error", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockResolvedValueOnce(null);
    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(null);

    expect(voucherService.applyVoucher).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict",
    });
  });
});
