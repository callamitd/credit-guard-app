# Credit Guard Architecture

## System Context Diagram

```mermaid
C4Context
    title System Context Diagram for Credit Guard

    Person(wholesaler, "Wholesaler / Distributor", "A user who manages credit, issues goods, and tracks repayments.")
    System(creditGuard, "Credit Guard System", "Allows wholesalers to manage retailers, track credit, and flag risky behavior.")
    
    System_Ext(smsGateway, "SMS Gateway", "Sends OTPs for authentication.")
    System_Ext(googleMaps, "Google Maps API", "Provides location services for retailer registration.")

    Rel(wholesaler, creditGuard, "Uses", "Mobile App")
    Rel(creditGuard, smsGateway, "Sends OTPs using", "API")
    Rel(creditGuard, googleMaps, "Geocodes addresses using", "API")
```

## Container Diagram

```mermaid
C4Container
    title Container Diagram for Credit Guard

    Person(wholesaler, "Wholesaler / Distributor", "A user who manages credit, issues goods, and tracks repayments.")

    Container_Boundary(c1, "Credit Guard System") {
        Container(mobileApp, "Mobile App", "React Native, Expo", "Provides the interface for managing retailers and transactions.")
        Container(apiApp, "API Application", "Node.js, Express", "Handles business logic, authentication, and data management.")
        ContainerDb(database, "Database", "MongoDB", "Stores retailer data, transactions, flags, and user profiles.")
        Container(fileStorage, "File Storage", "FileSystem / Cloud", "Stores retailer photos and evidence images.")
    }

    Rel(wholesaler, mobileApp, "Uses", "Touch Interface")
    Rel(mobileApp, apiApp, "Makes API calls to", "JSON/HTTPS")
    Rel(apiApp, database, "Reads from and writes to", "Mongoose")
    Rel(apiApp, fileStorage, "Stores and retrieves images", "File System API")
```

## Component Diagram (Backend - Inferred)

```mermaid
classDiagram
    class AuthController {
        +sendOtp(mobile)
        +verifyOtp(mobile, otp)
    }
    class RetailerController {
        +createRetailer(data)
        +getRetailer(id)
        +searchRetailers(query)
        +searchByFace(image)
    }
    class TransactionController {
        +issueGoods(data)
        +recordRepayment(data)
        +getHistory(retailerId)
    }
    class FlagController {
        +createFlag(data)
        +getFlags()
        +updateStatus(id, status)
    }

    class RetailerModel {
        +String name
        +String mobile
        +String shopName
        +String address
        +Object location
        +String photoUrl
        +Boolean consent
    }

    class TransactionModel {
        +ObjectId retailerId
        +String type
        +Number amount
        +Date date
    }

    API_Router --> AuthController
    API_Router --> RetailerController
    API_Router --> TransactionController
    API_Router --> FlagController

    RetailerController ..> RetailerModel
    TransactionController ..> TransactionModel
```

## Description

### Mobile Application
The **Credit Guard App** is built using **React Native** with **Expo**. It serves as the primary interface for wholesalers.
*   **Tech Stack**: React Native, Expo Router, NativeWind (Tailwind CSS), Axios.
*   **Key Features**:
    *   **Retailer Management**: Registration with photo and GPS location.
    *   **Transactions**: Issuing goods and recording repayments.
    *   **Risk Management**: Flagging retailers and viewing flags.
    *   **Face Search**: Searching for retailers using facial recognition.

### Backend API (Inferred)
The backend is a **Node.js** application likely using **Express**. It exposes RESTful endpoints consumed by the mobile app.
*   **Authentication**: OTP-based login flow.
*   **Data Handling**: Uses **Mongoose** to interact with MongoDB.
*   **Image Processing**: Handles image uploads for retailer photos and face search.

### Database
**MongoDB** is used as the primary data store.
*   **Collections**: `users`, `retailers`, `transactions`, `flags`.
