import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice',
      password: '123123',
      phone: '1234567890',
      role: 'client',
      gender: 'female',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'bob',
      password: '123123',
      phone: '0987654321',
      role: 'admin',
      gender: 'male',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      username: 'charlie',
      password: '123123',
      phone: '1112223333',
      role: 'staff',
      gender: 'male',
    },
  });

  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@example.com',
      username: 'drsmith',
      password: '123123',
      phone: '4445556666',
      role: 'doctor',
      gender: 'female',
    },
  });

  // Seed Pets
  const pet1 = await prisma.pet.create({
    data: {
      name: 'Buddy',
      age: 3,
      weight: 15.0,
      color: 'Brown',
      gender: 'male',
      breed: 'Beagle',
      avatar:
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ6hDDV0agDjhC-pxESSvOSbtsd59FDDFgBxfRCYVN1Z_vpmlPa',
      ownerId: user1.id,
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      name: 'Mittens',
      age: 2,
      weight: 10.0,
      color: 'Black',
      gender: 'female',
      breed: 'Siamese',
      avatar:
        'https://www.purina.co.uk/sites/default/files/styles/square_medium_440x440/public/2022-06/Siamese-Cat_0.jpg?itok=Qy1J6ZDS',
      ownerId: user2.id,
    },
  });

  // Seed Service Details
  const services = await prisma.serviceDetails.createMany({
    data: [
      {
        id: 'healthcare',
        serviceName: 'Healthcare Service',
        description: 'Annual healthcare checkup and vaccination for pets.',
        price: 50.0,
      },
      {
        id: 'grooming',
        serviceName: 'Grooming Service',
        description: 'Complete grooming service for pets.',
        price: 30.0,
      },
      {
        id: 'appointment',
        serviceName: 'Appointment Service',
        description: 'Schedule appointments for pet consultations.',
        price: 20.0,
      },
      {
        id: 'boarding',
        serviceName: 'Boarding Service',
        description: 'Safe and comfortable boarding for pets.',
        price: 40.0,
      },
    ],
  });

  const getDate = (day: number) => {
    const date = new Date(2024, 5, day);
    return date;
  };

  const addRevenue = async (serviceName: string, date: Date) => {
    const service = await prisma.serviceDetails.findUnique({
      where: { serviceName },
    });

    const existingRevenue = await prisma.revenue.findFirst({
      where: {
        serviceId: service.id,
        date,
      },
    });

    if (existingRevenue) {
      await prisma.revenue.update({
        where: {
          id: existingRevenue.id,
        },
        data: {
          total: {
            increment: service.price,
          },
          updatedAt: date,
        },
      });
      console.log(`Updated revenue for ${serviceName} on ${date}`);
    } else {
      await prisma.revenue.create({
        data: {
          serviceId: service.id,
          date,
          total: service.price,
          updatedAt: date,
        },
      });
      console.log(`Added revenue for ${serviceName} on ${date}`);
    }
  };

  enum ServiceStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
    Completed = 'completed',
  }
  const randomStatus = () => {
    const statuses = [
      ServiceStatus.Rejected,
      ServiceStatus.Approved,
      ServiceStatus.Pending,
      ServiceStatus.Completed,
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Seed Healthcare Services
  for (let i = 1; i <= 4; i++) {
    const status = randomStatus();
    await prisma.healthcareService.create({
      data: {
        petId: pet1.id,
        serviceId: 'healthcare',
        doctorId: doctorUser.id,
        description: `Routine check-up on ${i} June 2024`,
        temperature: 38.5,
        heartRate: 80,
        respiratoryRate: 20,
        weight: 15.0,
        bodyCondition: 'Good',
        symptoms: 'None',
        bloodTest: 'Normal',
        urineTest: 'Normal',
        xRay: 'Clear',
        diagnosis: 'Healthy',
        diet: 'Standard',
        date: getDate(i),
        medicine: ['Vitamins'],
        status,
        createdAt: getDate(i),
        updatedAt: getDate(i),
      },
    });
    if (status === 'completed') {
      await addRevenue('Healthcare Service', getDate(i));
    }
  }

  // Seed Grooming Services
  for (let i = 5; i <= 9; i++) {
    const status = randomStatus();
    await prisma.groomingService.create({
      data: {
        petId: pet2.id,
        serviceId: 'grooming',
        staffId: staffUser.id,
        date: getDate(i),
        additionalInfo: { notes: `Grooming session on ${i} June 2024` },
        status,
        createdAt: getDate(i),
        updatedAt: getDate(i),
      },
    });
    if (status === 'completed') {
      await addRevenue('Grooming Service', getDate(i));
    }
  }

  // Seed Boarding Services
  for (let i = 10; i <= 14; i++) {
    const status = randomStatus();
    await prisma.boardingService.create({
      data: {
        petId: pet1.id,
        serviceId: 'boarding',
        cage: 12,
        address: '123 Pet Boarding Street',
        date: getDate(i),
        status,
        createdAt: getDate(i),
        updatedAt: getDate(i),
      },
    });
    if (status === 'completed') {
      await addRevenue('Boarding Service', getDate(i));
    }
  }

  // Seed Appointments
  for (let i = 15; i <= 16; i++) {
    const status = randomStatus();
    await prisma.appointments.create({
      data: {
        petId: pet2.id,
        serviceId: 'appointment',
        doctorId: doctorUser.id,
        description: `Annual check-up on ${i} June 2024`,
        followUp: true,
        date: getDate(i),
        status,
        createdAt: getDate(i),
        updatedAt: getDate(i),
      },
    });
    if (status === 'completed') {
      await addRevenue('Appointment Service', getDate(i));
    }
  }

  // Seed Notifications
  await prisma.notification.create({
    data: {
      userId: user1.id,
      title: 'Appointment Reminder',
      description: 'Your appointment with Dr. Smith is scheduled for tomorrow.',
      date: new Date(),
      additionalInfo: { type: 'reminder' },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
