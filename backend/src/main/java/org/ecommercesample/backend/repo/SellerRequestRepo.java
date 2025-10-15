package org.ecommercesample.backend.repo;

import org.ecommercesample.backend.model.RequestStatus;
import org.ecommercesample.backend.model.SellerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRequestRepo extends JpaRepository<SellerRequest,Long> {
    Optional<SellerRequest> findByUserIdAndStatus(Long userId, RequestStatus status);
    List<SellerRequest> findByStatus(RequestStatus status);
    void deleteAllByUserId(Long userId);
}
