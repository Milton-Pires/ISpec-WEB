package br.com.ispec.Utils;

public class SenhaValidator {

    private static final int TAMANHO_MINIMO = 8;

    public static void validar(String senha) {
        if (senha == null || senha.length() < TAMANHO_MINIMO)
            throw new IllegalArgumentException("A senha deve ter no mínimo 8 caracteres.");

        if (!senha.matches(".*[A-Z].*"))
            throw new IllegalArgumentException("A senha deve conter ao menos uma letra maiúscula.");

        if (!senha.matches(".*[a-z].*"))
            throw new IllegalArgumentException("A senha deve conter ao menos uma letra minúscula.");

        if (!senha.matches(".*[0-9].*"))
            throw new IllegalArgumentException("A senha deve conter ao menos um número.");

        if (!senha.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*"))
            throw new IllegalArgumentException("A senha deve conter ao menos um símbolo especial.");
    }
}
