package com.transitops.service;

import com.transitops.dto.request.LoginRequest;
import com.transitops.dto.request.RegisterUserRequest;
import com.transitops.dto.response.LoginResponse;
import com.transitops.entity.User;
import com.transitops.enums.Role;
import com.transitops.exception.BusinessRuleException;
import com.transitops.repository.UserRepository;
import com.transitops.security.JwtUtil;
import com.transitops.security.LoginRateLimiterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private LoginRateLimiterService loginRateLimiterService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .name("Admin User")
                .email("admin@transitops.com")
                .password("encoded_pass")
                .role(Role.ADMIN)
                .build();
        sampleUser.setId(1L);
    }

    @Test
    @DisplayName("White-Box: Successful registration encodes password and persists User")
    void testRegister_Success() {
        RegisterUserRequest req = new RegisterUserRequest();
        req.setName("Admin User");
        req.setEmail("admin@transitops.com");
        req.setPassword("PlainPassword123");
        req.setRole(Role.ADMIN);

        when(userRepository.existsByEmail("admin@transitops.com")).thenReturn(false);
        when(passwordEncoder.encode("PlainPassword123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        User saved = authService.register(req);

        assertThat(saved).isNotNull();
        assertThat(saved.getEmail()).isEqualTo("admin@transitops.com");
        assertThat(saved.getPassword()).isEqualTo("encoded_pass");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("White-Box: Register with existing email throws BusinessRuleException")
    void testRegister_DuplicateEmail_ThrowsException() {
        RegisterUserRequest req = new RegisterUserRequest();
        req.setEmail("admin@transitops.com");

        when(userRepository.existsByEmail("admin@transitops.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Email already registered");
    }

    @Test
    @DisplayName("White-Box: Successful login returns JWT access and refresh tokens")
    void testLogin_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@transitops.com");
        req.setPassword("PlainPassword123");

        when(loginRateLimiterService.isBlocked("127.0.0.1", "admin@transitops.com")).thenReturn(false);
        when(userRepository.findByEmail("admin@transitops.com")).thenReturn(Optional.of(sampleUser));
        when(jwtUtil.generateAccessToken("admin@transitops.com", "ADMIN")).thenReturn("mock-access-token");
        when(jwtUtil.generateRefreshToken("admin@transitops.com")).thenReturn("mock-refresh-token");

        LoginResponse resp = authService.login(req, "127.0.0.1");

        assertThat(resp).isNotNull();
        assertThat(resp.getAccessToken()).isEqualTo("mock-access-token");
        assertThat(resp.getRefreshToken()).isEqualTo("mock-refresh-token");
        assertThat(resp.getRole()).isEqualTo(Role.ADMIN);
        verify(loginRateLimiterService, times(1)).recordSuccess("127.0.0.1", "admin@transitops.com");
    }

    @Test
    @DisplayName("White-Box: Blocked IP throws BusinessRuleException")
    void testLogin_Blocked_ThrowsException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@transitops.com");
        req.setPassword("PlainPassword123");

        when(loginRateLimiterService.isBlocked("192.168.1.100", "admin@transitops.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.login(req, "192.168.1.100"))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Too many failed login attempts");
    }
}
