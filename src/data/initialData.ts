import { User, Match, PaymentRecord, Court } from '../types';

export const INITIAL_USERS: User[] = [];

export const INITIAL_MATCHES: Match[] = [];

export const INITIAL_PAYMENTS: PaymentRecord[] = [];

export const INITIAL_COURTS: Court[] = [
  {
    id: 'court_lisi',
    name: 'Lisi Padel Club',
    nameKa: 'ლისი პადელ კლუბი',
    nameEn: 'Lisi Padel Club',
    address: 'Lisi Lake Road 4, Tbilisi',
    addressKa: 'ლისის ტბის გზა 4, თბილისი',
    addressEn: 'Lisi Lake Road 4, Tbilisi',
    district: 'Lisi',
    googleMapsUrl: 'https://maps.google.com/?q=Lisi+Lake+Tbilisi',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800',
    galleryImageUrls: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800'
    ],
    defaultCourtCostGel: 80,
    defaultPricePerPlayerGel: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'court_vake',
    name: 'Vake Padel Arena',
    nameKa: 'ვაკის პადელ არენა',
    nameEn: 'Vake Padel Arena',
    address: 'Chavchavadze Ave 75, Tbilisi',
    addressKa: 'ჭავჭავაძის გამზირი 75, თბილისი',
    addressEn: 'Chavchavadze Ave 75, Tbilisi',
    district: 'Vake',
    googleMapsUrl: 'https://maps.google.com/?q=Vake+Park+Tbilisi',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800',
    galleryImageUrls: [
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800'
    ],
    defaultCourtCostGel: 90,
    defaultPricePerPlayerGel: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'court_saburtalo',
    name: 'Saburtalo Padel Center',
    nameKa: 'საბურთალოს პადელ ცენტრი',
    nameEn: 'Saburtalo Padel Center',
    address: 'Peking Ave 22, Tbilisi',
    addressKa: 'პეკინის გამზირი 22, თბილისი',
    addressEn: 'Peking Ave 22, Tbilisi',
    district: 'Saburtalo',
    googleMapsUrl: 'https://maps.google.com/?q=Saburtalo+Tbilisi',
    imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800',
    galleryImageUrls: [
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800'
    ],
    defaultCourtCostGel: 80,
    defaultPricePerPlayerGel: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'court_dighomi',
    name: 'Dighomi Padel Complex',
    nameKa: 'დიღმის პადელ კომპლექსი',
    nameEn: 'Dighomi Padel Complex',
    address: 'Robakidze Ave 10, Tbilisi',
    addressKa: 'რობაქიძის გამზირი 10, თბილისი',
    addressEn: 'Robakidze Ave 10, Tbilisi',
    district: 'Dighomi',
    googleMapsUrl: 'https://maps.google.com/?q=Dighomi+Tbilisi',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
    galleryImageUrls: [],
    defaultCourtCostGel: 70,
    defaultPricePerPlayerGel: 20,
    createdAt: new Date().toISOString(),
  }
];
