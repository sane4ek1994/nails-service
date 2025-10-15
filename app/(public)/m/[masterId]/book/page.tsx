/**
 * /m/[masterId]/book - Booking page
 * Select service, date, time slot and confirm appointment
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Loading } from '@/src/shared/ui/loading';
import { Navigation } from '@/src/shared/ui/navigation';
import { formatPrice, formatDate } from '@/src/shared/lib/utils';
import { useBookingStore, useAuthStore } from '@/src/shared/lib/store';
import { generateGoogleCalendarURL } from '@/src/shared/lib/calendar';
import { Clock, Calendar, Download, ExternalLink } from 'lucide-react';
import type { Service, TimeSlot } from '@/src/shared/lib/store';

interface BookingPageProps {
  params: Promise<{ masterId: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  
  const [masterId, setMasterId] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const {
    selectedService,
    selectedSlot,
    setSelectedService,
    setSelectedSlot,
    reset,
  } = useBookingStore();

  useEffect(() => {
    params.then(({ masterId: id }) => {
      setMasterId(id);
      loadServices(id);
    });
  }, [params]);

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    if (serviceId && services.length > 0) {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [searchParams, services, setSelectedService]);

  useEffect(() => {
    if (selectedService && masterId) {
      loadSlots(masterId, selectedService.id, selectedDate);
    }
  }, [selectedService, selectedDate, masterId]);

  const loadServices = async (id: string) => {
    try {
      const response = await fetch(`/api/services?masterId=${id}`);
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  };

  const loadSlots = async (mId: string, sId: string, date: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/slots?masterId=${mId}&serviceId=${sId}&date=${date}`);
      const data = await response.json();
      setSlots(data.slots || []);
    } catch (err) {
      console.error('Failed to load slots:', err);
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      sessionStorage.setItem('booking_redirect', window.location.pathname + window.location.search);
      router.push('/auth');
      return;
    }

    if (!selectedService || !selectedSlot) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterId,
          serviceId: selectedService.id,
          startTime: selectedSlot.startTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create appointment');
      }

      setAppointmentId(data.appointment.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (appointmentId) {
    const googleCalendarUrl = selectedService && selectedSlot ? generateGoogleCalendarURL({
      title: selectedService.title,
      startTime: new Date(selectedSlot.startTime),
      endTime: new Date(selectedSlot.endTime),
    }) : '';

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600">Запись создана!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Ваша запись успешно создана. Добавьте событие в календарь:
            </p>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`/api/appointments/ics?id=${appointmentId}`, '_blank')}
              >
                <Download className="h-4 w-4" />
                Скачать .ics файл
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(googleCalendarUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Открыть в Google Calendar
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                reset();
                setAppointmentId(null);
                router.push(`/m/${masterId}`);
              }}
            >
              Вернуться к услугам
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        showBack={true}
        backUrl={`/m/${masterId}`}
        backLabel="К услугам мастера"
        title="Запись на услугу"
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

        <div className="space-y-6">
          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. Выберите услугу</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setSelectedSlot(null);
                    }}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      selectedService?.id === service.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{service.title}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {service.durationMin} мин
                      </span>
                      <span className="font-semibold">{formatPrice(service.priceCents)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          {selectedService && (
            <Card>
              <CardHeader>
                <CardTitle>2. Выберите дату</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  min={formatDate(new Date())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </CardContent>
            </Card>
          )}

          {/* Time Slot Selection */}
          {selectedService && (
            <Card>
              <CardHeader>
                <CardTitle>3. Выберите время</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loading />
                ) : slots.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Нет доступных слотов на выбранную дату
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.filter(s => s.available).map((slot, idx) => {
                      const time = new Date(slot.startTime).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                            selectedSlot?.startTime === slot.startTime
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Confirm */}
          {selectedService && selectedSlot && (
            <Card>
              <CardHeader>
                <CardTitle>4. Подтвердите запись</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Услуга:</span>
                    <span className="font-semibold">{selectedService.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дата:</span>
                    <span className="font-semibold">
                      {new Date(selectedSlot.startTime).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Время:</span>
                    <span className="font-semibold">
                      {new Date(selectedSlot.startTime).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Стоимость:</span>
                    <span className="font-semibold">{formatPrice(selectedService.priceCents)}</span>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>
                )}

                <Button onClick={handleBooking} disabled={isLoading} className="w-full">
                  {isLoading ? <Loading size="sm" /> : 'Подтвердить запись'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

