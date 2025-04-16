export const ok = (res, data = null, message = "OK") => {
  return res.status(200).json({ success: true, status: 200, message, data });
};

export const created = (res, data = null, message = "Created") => {
  return res.status(201).json({ success: true, status: 201, message, data });
};

export const accepted = (res, data = null, message = "Accepted") => {
  return res.status(202).json({ success: true, status: 202, message, data });
};

export const badRequest = (res, message = "Bad Request", error = null) => {
  return res.status(400).json({ success: false, status: 400, message, error });
};

export const unauthorized = (res, message = "Unauthorized", error = null) => {
  return res.status(401).json({ success: false, status: 401, message, error });
};

export const forbidden = (res, message = "Forbidden", error = null) => {
  return res.status(403).json({ success: false, status: 403, message, error });
};

export const notFound = (res, message = "Not Found", error = null) => {
  return res.status(404).json({ success: false, status: 404, message, error });
};

export const conflict = (res, message = "Conflict", error = null) => {
  return res.status(409).json({ success: false, status: 409, message, error });
};

export const serverError = (
  res,
  message = "Internal Server Error",
  error = null
) => {
  return res.status(500).json({ success: false, status: 500, message, error });
};
