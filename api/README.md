# API Reference

This directory serves as the reference point for all API endpoint documentation.

## Base URL

```
http://localhost:5001/api
```

## API Implementation

All API routes are implemented in modular fashion at:
```
backend/src/modules/<module_name>/
```

Each module contains:
- `controller.ts` — Request handlers
- `routes.ts` — Route definitions
- `services.ts` — Business logic (where applicable)

## Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Email/password login |
| POST | `/register` | Register new school + admin |
| POST | `/google` | Google OAuth login |

### Users (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List users |
| POST | `/` | Create user |

### Schools (`/api/schools`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List schools |

### Students (`/api/students`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List students |
| POST | `/` | Create student |
| GET | `/:id` | Get student by ID |
| PUT | `/:id` | Update student |
| DELETE | `/:id` | Delete student |

### Classes (`/api/classes`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List classes |
| POST | `/` | Create class |

### Sections (`/api/sections`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List sections |
| POST | `/` | Create section |

### Attendance (`/api/attendance`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get attendance records |
| POST | `/` | Mark attendance |

### Fees (`/api/fees`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List fee structures |
| GET | `/dues` | Get pending dues |
| POST | `/` | Create fee structure |

### Payments (`/api/payments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/fees/order` | Create Razorpay order |
| POST | `/verify` | Verify Razorpay payment |

### Exams (`/api/exams`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List exams |
| POST | `/` | Create exam |

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```
