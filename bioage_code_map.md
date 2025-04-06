
# 📱 BioAge App - Mermaid Codebase Map

## 📁 Folder Structure

```mermaid
flowchart TD
    Root["Root (App)"]
    Root --> Tabs["(tabs)"]
    Root --> Auth["(auth)"]
    Root --> Pages["Other Pages"]
    
    Tabs --> Index["Home (index.tsx)"]
    Tabs --> Profile
    Tabs --> Calculator
    Tabs --> Recommendations
    
    Auth --> Login
    Auth --> Signup
    
    Pages --> History
    Pages --> Trends
    Pages --> Notifications
    Pages --> Onboarding
```

---

## 🧭 Navigation Flow

```mermaid
flowchart TD
    AppStart["App _layout.tsx"]
    AppStart --> AuthFlow
    AppStart --> MainTabs

    AuthFlow --> Login
    AuthFlow --> Signup

    MainTabs --> Home
    MainTabs --> Profile
    MainTabs --> Calculator
    MainTabs --> Recommendations
```

---

## 🔁 Health Data Calculation (Example Flow)

```mermaid
sequenceDiagram
    participant User
    participant App
    participant HealthModule
    participant Storage

    User->>App: Opens Calculator
    App->>HealthModule: Fetch or calculate data
    HealthModule->>Storage: Save results
    Storage-->>App: Confirmation
    App-->>User: Display BioAge
```

---

## 🧠 Zustand State Flow (if applicable)

```mermaid
stateDiagram-v2
    [*] --> InitializingStore
    InitializingStore --> HydratingFromAsyncStorage
    HydratingFromAsyncStorage --> Ready
    Ready --> UpdatingState : User input
    UpdatingState --> Ready
```

---

## 📐 Data Models (Based on `types/user.ts` and `types/health.ts`)

```mermaid
classDiagram
    class User {
        id: string
        name: string
        email: string
    }

    class HealthData {
        weight: number
        height: number
        bmi: number
    }

    User --> HealthData : has
```
