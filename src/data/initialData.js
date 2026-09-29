export const INITIAL_DONORS = [
  {
    uid: 'donor-1',
    name: 'Sridharan A',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    state: 'Tamil Nadu',
    city: 'Madurai',
    address: 'KK Nagar, Madurai',
    role: 'donor',
    isAvailable: true,
    lat: 9.9252,
    lng: 78.1198,
    lastDonationDate: '2026-05-15'
  },
  {
    uid: 'donor-2',
    name: 'Karthik Raja',
    bloodGroup: 'A+',
    phone: '+91 94431 88921',
    state: 'Tamil Nadu',
    city: 'Chennai',
    address: 'Anna Nagar, Chennai',
    role: 'donor',
    isAvailable: true,
    lat: 13.0827,
    lng: 80.2707,
    lastDonationDate: '2026-06-20'
  },
  {
    uid: 'donor-3',
    name: 'Priya Sharma',
    bloodGroup: 'B+',
    phone: '+91 98450 11234',
    state: 'Karnataka',
    city: 'Bangalore Urban',
    address: 'Indiranagar, Bangalore',
    role: 'donor',
    isAvailable: true,
    lat: 12.9716,
    lng: 77.5946,
    lastDonationDate: '2026-04-10'
  },
  {
    uid: 'donor-4',
    name: 'Arun Kumar',
    bloodGroup: 'O-',
    phone: '+91 97890 55432',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'RS Puram, Coimbatore',
    role: 'donor',
    isAvailable: true,
    lat: 11.0168,
    lng: 76.9558,
    lastDonationDate: '2026-03-01'
  },
  {
    uid: 'donor-5',
    name: 'Deepak Patel',
    bloodGroup: 'AB+',
    phone: '+91 99250 88765',
    state: 'Maharashtra',
    city: 'Mumbai City',
    address: 'Andheri West, Mumbai',
    role: 'donor',
    isAvailable: true,
    lat: 19.0760,
    lng: 72.8777,
    lastDonationDate: '2026-07-02'
  }
];

export const INITIAL_REQUESTS = [
  {
    requestId: 'req-1',
    patientName: 'Meenakshi Sundaram',
    bloodGroup: 'O+',
    unitsRequired: 2,
    hospitalName: 'Government Rajaji Hospital',
    state: 'Tamil Nadu',
    city: 'Madurai',
    address: 'Alagar Kovil Road, Goripalayam',
    emergencyLevel: 'CRITICAL',
    purpose: 'Emergency Heart Surgery',
    mobile: '+91 98940 12345',
    email: 'help@grh-hospital.org',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lat: 9.9312,
    lng: 78.1310,
    acceptedDonorId: null,
    acceptedDonorName: null
  },
  {
    requestId: 'req-2',
    patientName: 'Sanjay Verma',
    bloodGroup: 'A+',
    unitsRequired: 3,
    hospitalName: 'Apollo Speciality Hospitals',
    state: 'Tamil Nadu',
    city: 'Chennai',
    address: 'Greams Road, Thousand Lights',
    emergencyLevel: 'URGENT',
    purpose: 'Accident Trauma Recovery',
    mobile: '+91 98401 54321',
    email: 'trauma@apollohospitals.com',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    lat: 13.0569,
    lng: 80.2525,
    acceptedDonorId: null,
    acceptedDonorName: null
  },
  {
    requestId: 'req-3',
    patientName: 'Ananya Deshmukh',
    bloodGroup: 'B+',
    unitsRequired: 1,
    hospitalName: 'Lilavati Hospital & Research Centre',
    state: 'Maharashtra',
    city: 'Mumbai City',
    address: 'A-791, Bandra Reclamation, Bandra West',
    emergencyLevel: 'NORMAL',
    purpose: 'Planned Chemotherapy Support',
    mobile: '+91 98200 67890',
    email: 'bloodbank@lilavatihospital.com',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    lat: 19.0522,
    lng: 72.8315,
    acceptedDonorId: null,
    acceptedDonorName: null
  }
];

export const INITIAL_HOSPITALS = [
  {
    name: 'Government Rajaji Hospital (Blood Bank)',
    city: 'Madurai',
    state: 'Tamil Nadu',
    lat: 9.9312,
    lng: 78.1310,
    phone: '0452-2532535'
  },
  {
    name: 'Apollo Hospital Blood Bank',
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0569,
    lng: 80.2525,
    phone: '044-28290200'
  },
  {
    name: 'Manipal Hospital Blood Centre',
    city: 'Bangalore Urban',
    state: 'Karnataka',
    lat: 12.9592,
    lng: 77.6499,
    phone: '080-25024444'
  }
];

export const INITIAL_BLOOD_BANKS = [
  {
    _id: 'bb-1',
    id: 'bb-1',
    name: 'Government Rajaji Hospital Blood Centre',
    hospitalName: 'Government Rajaji Hospital',
    address: 'Alagar Kovil Road, Goripalayam',
    city: 'Madurai',
    district: 'Madurai',
    state: 'Tamil Nadu',
    contact: '+91 0452-2532535',
    phone: '+91 0452-2532535',
    email: 'bloodbank@grhmadurai.tn.gov.in',
    operatingHours: '24/7 Emergency Service',
    distanceKm: 1.8,
    lat: 9.9312,
    lng: 78.131,
    availableBloodGroups: {
      'A+': 24, 'A-': 6, 'B+': 19, 'B-': 4,
      'AB+': 11, 'AB-': 3, 'O+': 32, 'O-': 8
    },
    verified: true
  },
  {
    _id: 'bb-2',
    id: 'bb-2',
    name: 'Apollo Speciality Blood Bank',
    hospitalName: 'Apollo Speciality Hospital',
    address: 'Greams Road, Thousand Lights',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    contact: '+91 044-28290200',
    phone: '+91 044-28290200',
    email: 'bloodcentre@apollohospitals.com',
    operatingHours: '24/7 Emergency Service',
    distanceKm: 3.5,
    lat: 13.0569,
    lng: 80.2525,
    availableBloodGroups: {
      'A+': 35, 'A-': 9, 'B+': 28, 'B-': 7,
      'AB+': 14, 'AB-': 5, 'O+': 46, 'O-': 12
    },
    verified: true
  },
  {
    _id: 'bb-3',
    id: 'bb-3',
    name: 'Manipal Comprehensive Blood Centre',
    hospitalName: 'Manipal Hospital',
    address: '98 HAL Airport Road, Kodihalli',
    city: 'Bangalore Urban',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    contact: '+91 080-25024444',
    phone: '+91 080-25024444',
    email: 'bloodbank@manipalhospitals.com',
    operatingHours: '24/7 Emergency Service',
    distanceKm: 4.2,
    lat: 12.9592,
    lng: 77.6499,
    availableBloodGroups: {
      'A+': 16, 'A-': 4, 'B+': 14, 'B-': 3,
      'AB+': 8, 'AB-': 2, 'O+': 22, 'O-': 5
    },
    verified: true
  },
  {
    _id: 'bb-4',
    id: 'bb-4',
    name: 'Lilavati Hospital & Research Blood Bank',
    hospitalName: 'Lilavati Hospital',
    address: 'A-791, Bandra Reclamation, Bandra West',
    city: 'Mumbai City',
    district: 'Mumbai City',
    state: 'Maharashtra',
    contact: '+91 022-26751000',
    phone: '+91 022-26751000',
    email: 'bloodbank@lilavatihospital.com',
    operatingHours: '24/7 Emergency Service',
    distanceKm: 5.0,
    lat: 19.0522,
    lng: 72.8315,
    availableBloodGroups: {
      'A+': 18, 'A-': 5, 'B+': 20, 'B-': 6,
      'AB+': 7, 'AB-': 2, 'O+': 28, 'O-': 9
    },
    verified: true
  }
];

export const INITIAL_CAMPS = [
  {
    _id: 'camp-1',
    id: 'camp-1',
    name: 'Red Cross Mega Blood Donation Drive',
    organizer: 'Indian Red Cross Society',
    date: '2026-10-15',
    time: '09:00 AM - 04:00 PM',
    venue: 'Madurai Gandhi Memorial Museum Grounds',
    city: 'Madurai',
    state: 'Tamil Nadu',
    contact: '+91 94431 00001',
    registeredCount: 42
  },
  {
    _id: 'camp-2',
    id: 'camp-2',
    name: 'Youth For Life Donation Camp',
    organizer: 'Rotary Club of Madras',
    date: '2026-10-22',
    time: '10:00 AM - 03:00 PM',
    venue: 'Anna University Campus, Guindy',
    city: 'Chennai',
    state: 'Tamil Nadu',
    contact: '+91 98401 00002',
    registeredCount: 65
  }
];

