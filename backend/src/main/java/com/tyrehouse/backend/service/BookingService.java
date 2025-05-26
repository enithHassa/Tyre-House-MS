package com.tyrehouse.backend.service;

import com.tyrehouse.backend.model.Booking;
import com.tyrehouse.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }
    public Optional<Booking> getBooking(Long id) {
        return bookingRepository.findById(id);
    }
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    public Optional<Booking> updateBooking(Long id, Booking updatedBooking) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setName(updatedBooking.getName());
            booking.setEmail(updatedBooking.getEmail());
            booking.setContactNo(updatedBooking.getContactNo());
            booking.setDate(updatedBooking.getDate());
            booking.setTime(updatedBooking.getTime());
            booking.setDescription(updatedBooking.getDescription());
            return bookingRepository.save(booking);
        });
    }
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email);
    }
} 