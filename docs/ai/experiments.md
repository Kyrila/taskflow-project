Problema 1 - Comprobar si un número es par o impar

    numero = int(input("Introduce un número:")) 
    if numero % 2 == 0:
        print("El número es par")
    else:
        print("El número es impar")

    ChatGPT: da código con mini explicación de cada trozo
    Claude: da código con una explicación más detallada e incluso te propone una versión más robusta con try/catch
    Copilot: da código en dos lenguajes distintos (python y node.js)

Problema 2 - Contar vocales en una frase

    frase = input("Introduce una frase: ")
    vocales = "aeiouAEIOU"
    contador = 0

    for letra in frase:
        if letra in vocales:
            contador += 1

    print("La frase tiene", contador, "vocales.")

    ChatGPT: da código con mini explicación de cada trozo
    Claude: vocales ->aeiouáéíóúAEIOUÁÉÍÓÚ + uso de .lower + explicaciones
    Copilot: da código en dos lenguajes distintos (python y javascript)

Problema 3 - Sumar del 1 al N

    numero = int(input("Introduce número: "))
    suma = 0
    for i in range(1, N + 1):
        suma += i
    print(suma)

    ChatGPT: da código con mini explicación de cada trozo + Versión corta usando fórmula matemática
    Claude: enseña 3 métodos de resolverlo
    Copilot: enseña 4 formas de resolverlo (2 con python y otros dos con javascript)