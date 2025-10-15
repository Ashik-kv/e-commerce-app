package org.ecommercesample.backend.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotBlank
    @Column(nullable=false)
    private String name;
    @NotBlank
    @Column(nullable=false)
    private  String addressLine1;
    @NotBlank
    @Column(nullable=false)
    private String city;
    @Column(nullable=false)
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 digits")
    private String phoneNumber;
    @Size(min = 6, max = 6, message = "Pincode must be 6 digits")
    @Column(nullable=false)
    private String pinCode;
    @NotBlank
    @Column(nullable=false)
    private String state;
    private String landmark;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    @JsonIgnore
    @ToString.Exclude
    private User user;
    @OneToMany(mappedBy = "shippingAddress")
    @JsonIgnore
    @Builder.Default
    private List<Order> orders = new ArrayList<>();
    private boolean active = true;
}
