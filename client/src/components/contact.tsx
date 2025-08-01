import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { z } from "zod";

type ContactFormData = z.infer<typeof insertContactMessageSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact-messages", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Send Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    sendMessageMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-testid="contact-title">
            Get In Touch
          </h2>
          <p className="text-xl text-slate-600" data-testid="contact-subtitle">
            Have questions? We're here to help you choose the right service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4" data-testid="contact-location">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-custom rounded-lg flex items-center justify-center">
                <MapPin className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Office Location</h4>
                <p className="text-slate-600">
                  123 Business District<br />
                  New York, NY 10001
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4" data-testid="contact-phone">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-custom rounded-lg flex items-center justify-center">
                <Phone className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Phone</h4>
                <p className="text-slate-600">(555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-4" data-testid="contact-email">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-custom rounded-lg flex items-center justify-center">
                <Mail className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Email</h4>
                <p className="text-slate-600">contact@bookeasy.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4" data-testid="contact-hours">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-custom rounded-lg flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Business Hours</h4>
                <p className="text-slate-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-6" data-testid="contact-form-title">
              Send us a Message
            </h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Your name"
                  data-testid="input-contact-name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Your email"
                  data-testid="input-contact-email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject
                </Label>
                <Input
                  id="subject"
                  {...form.register("subject")}
                  placeholder="Message subject"
                  data-testid="input-contact-subject"
                />
                {form.formState.errors.subject && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  {...form.register("message")}
                  rows={4}
                  placeholder="Your message"
                  data-testid="input-contact-message"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={sendMessageMutation.isPending}
                className="w-full bg-primary-custom text-white py-3 rounded-lg font-semibold hover:bg-secondary-custom transition-colors"
                data-testid="button-send-message"
              >
                {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
