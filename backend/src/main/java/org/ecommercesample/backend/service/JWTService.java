package org.ecommercesample.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    private static final long EXPIRATION_TIME = 1000 * 60 * 60;
    private String secretKey;

    public JWTService() {
        secretKey = generateSecretKey();
    }
    private String generateSecretKey(){
        try {
            KeyGenerator keyGenerator=KeyGenerator.getInstance("HmacSHA256");
            SecretKey secretKey=keyGenerator.generateKey();
            System.out.println(secretKey.toString());
            return Base64.getEncoder().encodeToString(secretKey.getEncoded());
        }
        catch (NoSuchAlgorithmException e){
            throw new RuntimeException("Error generating key",e);
        }
    }

    public String generateToken(String userEmail) {

        Map<String, Object> claims = new HashMap<String, Object>();
        return Jwts.builder()
                .claims(claims)
                .subject(userEmail)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getKey())
                .compact();
    }
    private Key getKey() {
        byte[] keyBytes= Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserEmail(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims=extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName=extractUserEmail(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
