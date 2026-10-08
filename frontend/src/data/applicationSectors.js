import agricultureImage from '../assets/applications/agricultural.png';
import commercialImage from '../assets/applications/commercial.png';
import educationImage from '../assets/applications/education.png';
import evChargingImage from '../assets/applications/ev-charging.png';
import healthcareImage from '../assets/applications/healthcare.png';
import industrialImage from '../assets/applications/industrial.png';
import infrastructureImage from '../assets/applications/infrastrusture.png';
import residentialImage from '../assets/applications/residential.png';

export const applicationSectors = [
    {
      title: 'Residential',
      description: 'Reliable solar solutions for homes that reduce electricity bills and provide energy independence.',
      image: residentialImage,
      path: '/kits',
    },
    {
      title: 'Commercial',
      description: 'Cost-effective energy systems for offices, hotels, malls, shops, and commercial buildings.',
      image: commercialImage,
      path: '/browse',
    },
    {
      title: 'Industrial',
      description: 'High-capacity solar systems for factories, warehouses, workshops, and industrial operations.',
      image: industrialImage,
      path: '/browse',
    },
    {
      title: 'Agriculture',
      description: 'Solar water pumps and irrigation systems to power farms and agricultural projects.',
      image: agricultureImage,
      path: '/kit/agri-solar',
    },
    {
      title: 'Healthcare',
      description: 'Uninterrupted power for hospitals, clinics, laboratories, and medical facilities with reliable solar energy.',
      image: healthcareImage,
      path: '/browse',
    },
    {
      title: 'Education',
      description: 'Clean energy for schools, universities, training centers, dormitories, and learning institutions.',
      image: educationImage,
      path: '/browse',
    },
    {
      title: 'Public infrastructure',
      description: 'Solar street lights and public lighting solutions for smart cities, roads, and communities.',
      image: infrastructureImage,
      path: '/category/solar-street-lights',
    },
    {
      title: 'E-Mobility',
      description: 'Solar-powered EV charging stations for cleaner transport, fleet yards, and commercial parking sites.',
      image: evChargingImage,
      path: '/kit/solar-ev-station',
    },
  ];

