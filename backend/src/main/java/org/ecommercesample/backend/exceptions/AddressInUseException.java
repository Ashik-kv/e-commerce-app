package org.ecommercesample.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class AddressInUseException extends RuntimeException {
    public AddressInUseException(String message) {
        super(message);
    }
}