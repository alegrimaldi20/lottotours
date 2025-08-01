import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Service, type InsertAppointment, insertAppointmentSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bus, TrendingUp, Handshake } from "lucide-react";
import { z } from "zod";

const getIconComponent = (iconClass: string) => {
  switch (iconClass) {
    case "fas fa-user-tie":
      return Bus;
    case "fas fa-chart-line":
      return TrendingUp;
    case "fas fa-handshake":
      return Handshake;
    default:
      return Bus;
  }
};

const bookingFormSchema = insertAppointmentSchema.extend({
  appointmentDate: z.string().min(1, "Please select a date"),
  appointmentTime: z.string().min(1, "Please select a time"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function Booking() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { toast } = useToast();

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: availableSlots } = useQuery<string[]>({
    queryKey: ["/api/available-slots", selectedDate],
    enabled: !!selectedDate,
  });

  const selectedService = services?.find(s => s.id === selectedServiceId);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceId: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Appointment Confirmed!",
        description: "Your appointment has been successfully booked. Check your email for details.",
      });
      form.reset();
      setSelectedServiceId("");
      setSelectedDate("");
      setSelectedTime("");
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createAppointmentMutation.mutate(data);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    form.setValue("serviceId", serviceId);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    form.setValue("appointmentDate", date);
    form.setValue("appointmentTime", "");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    form.setValue("appointmentTime", time);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="booking-title">
            Book Your Appointment
          </h2>
          <p className="text-xl text-slate-600" data-testid="booking-subtitle">
            Select your preferred service and time slot. You'll receive instant confirmation.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Service Selection */}
            <div>
              <Label className="block text-sm font-semibold text-slate-700 mb-3">
                Select Service
              </Label>
              <div className="grid sm:grid-cols-3 gap-3">
                {services?.map((service) => {
                  const IconComponent = getIconComponent(service.icon);
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceSelect(service.id)}
                      className={`p-4 border-2 rounded-lg transition-colors text-left ${
                        isSelected
                          ? 'border-primary-custom bg-blue-50'
                          : 'border-slate-200 hover:border-primary-custom hover:bg-blue-50'
                      }`}
                      data-testid={`select-service-${service.id}`}
                    >
                      <div className="flex items-center mb-2">
                        <IconComponent size={20} className={isSelected ? 'text-primary-custom' : 'text-slate-600'} />
                        <div className={`font-medium ml-2 ${isSelected ? 'text-primary-custom' : ''}`}>
                          {service.name}
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        ${(service.price / 100).toFixed(0)} • {service.duration} min
                      </div>
                    </button>
                  );
                })}
              </div>
              {form.formState.errors.serviceId && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.serviceId.message}</p>
              )}
            </div>

            {/* Date and Time Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="appointmentDate" className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Date
                </Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full"
                  data-testid="input-appointment-date"
                />
                {form.formState.errors.appointmentDate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.appointmentDate.message}</p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-semibold text-slate-700 mb-3">
                  Available Times
                </Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {selectedDate ? (
                    availableSlots?.length ? (
                      availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        const displayTime = new Date(`2000-01-01T${slot}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        });
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleTimeSelect(slot)}
                            className={`p-2 text-sm border rounded transition-colors ${
                              isSelected
                                ? 'bg-primary-custom text-white border-primary-custom'
                                : 'border-slate-300 hover:border-primary-custom hover:bg-blue-50'
                            }`}
                            data-testid={`select-time-${slot}`}
                          >
                            {displayTime} {isSelected && '✓'}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-500 col-span-2">No available slots for this date</p>
                    )
                  ) : (
                    <p className="text-sm text-slate-500 col-span-2">Please select a date first</p>
                  )}
                </div>
                {form.formState.errors.appointmentTime && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.appointmentTime.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="clientName" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </Label>
                <Input
                  id="clientName"
                  {...form.register("clientName")}
                  placeholder="Enter your full name"
                  data-testid="input-client-name"
                />
                {form.formState.errors.clientName && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.clientName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="clientEmail" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  {...form.register("clientEmail")}
                  placeholder="Enter your email"
                  data-testid="input-client-email"
                />
                {form.formState.errors.clientEmail && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.clientEmail.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="clientPhone" className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </Label>
              <Input
                id="clientPhone"
                type="tel"
                {...form.register("clientPhone")}
                placeholder="Enter your phone number"
                data-testid="input-client-phone"
              />
              {form.formState.errors.clientPhone && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.clientPhone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                rows={3}
                placeholder="Any specific topics or questions you'd like to discuss?"
                data-testid="input-notes"
              />
            </div>

            {/* Booking Summary */}
            {selectedService && selectedDate && selectedTime && (
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3" data-testid="booking-summary-title">
                  Booking Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium" data-testid="summary-service">
                      {selectedService.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-medium" data-testid="summary-datetime">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} at {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium" data-testid="summary-duration">
                      {selectedService.duration} minutes
                    </span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary-custom" data-testid="summary-total">
                        ${(selectedService.price / 100).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={createAppointmentMutation.isPending}
              className="w-full bg-primary-custom text-white py-4 rounded-lg font-semibold text-lg hover:bg-secondary-custom transition-colors shadow-lg"
              data-testid="button-confirm-booking"
            >
              {createAppointmentMutation.isPending ? "Confirming..." : "Confirm Booking"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
