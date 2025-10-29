# Error Pages Usage Guide

## 🚨 **Error Pages Created:**

### **1. 404 Not Found** (`/src/app/not-found.tsx`)
- **Automatically triggered**: When users visit non-existent pages
- **Medical-themed design**: Healthcare professional imagery and messaging
- **Features**: 
  - Floating medical icons animation
  - Diagnostic suggestions
  - Return to dashboard button
  - Medical support contact

### **2. 403 Forbidden** (`/src/app/forbidden/page.tsx`)
- **Smart error page**: Adapts based on the reason for denial
- **Query parameters**: 
  - `?reason=not_authenticated` - Shows sign-in options
  - `?reason=insufficient_permissions` - Shows role-based restrictions
  - `?reason=license_expired` - Shows license verification needed
  - `?return=/dashboard` - Where to redirect after resolution

### **3. 403 Unauthorized** (`/src/app/unauthorized/page.tsx`)
- **General access denied**: For cases where specific roles are required
- **HIPAA compliance**: Shows medical data protection notices
- **Credential requirements**: Displays what's needed for access

## 🛠 **How to Use in Your Code:**

### **Server Actions & API Routes:**
```typescript
import { redirectToForbidden } from '@/lib/auth/permissions'

// In a server action or API route
export async function accessMedicalRecord(recordId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirectToForbidden('not_authenticated', '/medical-records')
  }
  
  if (user.role !== 'radiologist' && user.role !== 'admin') {
    redirectToForbidden('insufficient_permissions')
  }
  
  if (user.licenseExpired) {
    redirectToForbidden('license_expired')
  }
  
  // Proceed with authorized access...
}
```

### **Middleware Updates:**
The middleware now redirects to `/forbidden?reason=not_authenticated` instead of `/login`

### **Component-Level Protection:**
```typescript
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { checkMedicalAccess } from '@/lib/auth/permissions'

export function MedicalDataComponent() {
  const { user } = useAuth()
  
  if (!user) {
    return <div>Please sign in to view medical data</div>
  }
  
  if (!checkMedicalAccess(user.role, ['radiologist', 'admin'])) {
    return <div>Insufficient permissions to view this data</div>
  }
  
  return <div>Protected medical content...</div>
}
```

## 🎨 **Design Features:**

### **Medical Theming:**
- ✅ Healthcare professional color scheme
- ✅ Medical icons (stethoscope, shields, hospital symbols)
- ✅ HIPAA compliance messaging
- ✅ Professional typography and spacing

### **Animations:**
- ✅ Floating background icons
- ✅ Pulse animations for important elements
- ✅ Smooth hover transitions
- ✅ Loading states

### **Responsive Design:**
- ✅ Mobile-first approach
- ✅ Touch-friendly buttons
- ✅ Readable on all devices
- ✅ Professional appearance on tablets/workstations

## 🚀 **Testing the Error Pages:**

### **404 Page:**
- Visit any non-existent URL: `http://localhost:3000/non-existent-page`

### **403 Forbidden - Not Authenticated:**
- Visit: `http://localhost:3000/forbidden?reason=not_authenticated`

### **403 Forbidden - Insufficient Permissions:**
- Visit: `http://localhost:3000/forbidden?reason=insufficient_permissions`

### **403 Forbidden - License Expired:**
- Visit: `http://localhost:3000/forbidden?reason=license_expired`

### **403 Unauthorized (General):**
- Visit: `http://localhost:3000/unauthorized`

## 🔐 **Security Features:**

### **HIPAA Compliance:**
- Clear messaging about protected health information
- Proper access control messaging
- Emergency contact information for urgent medical access

### **Audit Trail:**
Use the `createAccessLog` function to log security events:
```typescript
import { createAccessLog } from '@/lib/auth/permissions'

// Log access denial
const logEntry = createAccessLog(
  user.id,
  '/patient-records/123',
  'insufficient_permissions',
  user.role,
  request.ip
)
console.log(logEntry) // Send to your logging service
```

### **Role-Based Access:**
- Built-in role hierarchy system
- Medical professional role definitions
- Permission checking utilities

## 📱 **Mobile Experience:**
- Touch-friendly buttons for mobile devices
- Readable text on small screens
- Proper spacing for finger navigation
- Emergency contact numbers are clickable

These error pages provide a professional, secure, and user-friendly experience that's appropriate for a medical application while maintaining HIPAA compliance and security best practices.