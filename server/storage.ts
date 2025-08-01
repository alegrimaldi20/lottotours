import { 
  type Service, type InsertService,
  type Appointment, type InsertAppointment,
  type Review, type InsertReview,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;

  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByService(serviceId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  // Available time slots
  getAvailableTimeSlots(date: string): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private services: Map<string, Service>;
  private appointments: Map<string, Appointment>;
  private reviews: Map<string, Review>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.services = new Map();
    this.appointments = new Map();
    this.reviews = new Map();
    this.contactMessages = new Map();

    // Initialize with default services
    this.initializeServices();
    this.initializeReviews();
  }

  private initializeServices() {
    const defaultServices: Service[] = [
      {
        id: "business-consultation",
        name: "Business Consultation",
        description: "Strategic planning and business development guidance for growing companies.",
        price: 15000, // $150.00
        duration: 60,
        icon: "fas fa-user-tie"
      },
      {
        id: "financial-planning",
        name: "Financial Planning",
        description: "Comprehensive financial analysis and investment strategy development.",
        price: 20000, // $200.00
        duration: 90,
        icon: "fas fa-chart-line"
      },
      {
        id: "legal-advisory",
        name: "Legal Advisory",
        description: "Expert legal consultation for business and personal matters.",
        price: 25000, // $250.00
        duration: 75,
        icon: "fas fa-handshake"
      }
    ];

    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });
  }

  private initializeReviews() {
    const defaultReviews: Review[] = [
      {
        id: "review-1",
        reviewerName: "Michael Johnson",
        serviceId: "business-consultation",
        rating: 5,
        content: "Exceptional service and expertise. The consultation was thorough and the advice was immediately actionable. Highly recommend!",
        createdAt: new Date("2023-12-15")
      },
      {
        id: "review-2",
        reviewerName: "Sarah Chen",
        serviceId: "financial-planning",
        rating: 5,
        content: "The financial planning session helped me restructure my investment portfolio. Clear explanations and practical strategies.",
        createdAt: new Date("2023-11-28")
      },
      {
        id: "review-3",
        reviewerName: "David Rodriguez",
        serviceId: "legal-advisory",
        rating: 5,
        content: "Professional legal advice that saved my business thousands. Quick response time and excellent communication throughout.",
        createdAt: new Date("2023-12-10")
      }
    ];

    defaultReviews.forEach(review => {
      this.reviews.set(review.id, review);
    });
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = { 
      ...insertAppointment, 
      id, 
      status: "confirmed",
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getReviewsByService(serviceId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.serviceId === serviceId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getAvailableTimeSlots(date: string): Promise<string[]> {
    // Get booked appointments for the given date
    const bookedSlots = Array.from(this.appointments.values())
      .filter(apt => apt.appointmentDate === date)
      .map(apt => apt.appointmentTime);

    // Generate all possible time slots (9 AM to 6 PM, 30-minute intervals)
    const allSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ];

    // Return available slots
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  }
}

export const storage = new MemStorage();
