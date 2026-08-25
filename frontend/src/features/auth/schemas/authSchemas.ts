import { LoginRequest, RegisterRequest } from "./auth";

export const validateLogin = (data: Partial<LoginRequest>) => {
  const e: Record<string, string> = {};
  if (!data.username) e.username = "Vui lòng nhập trường này.";
  else if (data.username.includes("@") && !/\S+@\S+\.\S+/.test(data.username)) {
    e.username = "Vui lòng nhập email hợp lệ.";
  }
  if (!data.password) e.password = "Vui lòng nhập trường này.";
  return e;
};

export const validateRegister = (data: Partial<RegisterRequest & { confirm: string }>) => {
  const e: Record<string, string> = {};
  if (!data.username) e.username = "Vui lòng nhập trường này.";
  if (!data.fullName) e.fullName = "Vui lòng nhập trường này.";

  if (!data.email) e.email = "Vui lòng nhập trường này.";
  else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "Vui lòng nhập email hợp lệ.";

  if (!data.phone) e.phone = "Vui lòng nhập trường này.";
  else if (!/^0\d{9}$/.test(data.phone)) e.phone = "Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng số 0, gồm 10 số).";

  if (!data.password) e.password = "Vui lòng nhập trường này.";
  else if (data.password.length < 8) e.password = "Mật khẩu phải dài ít nhất 8 ký tự.";

  if (!data.confirm) e.confirm = "Vui lòng nhập trường này.";
  else if (data.confirm !== data.password) e.confirm = "Mật khẩu không khớp.";

  return e;
};
