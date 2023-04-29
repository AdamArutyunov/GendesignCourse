import numpy as np

def generate_exponential_interpolator(start_y, end_y, x_range, b):
    x_values = np.linspace(x_range[0], x_range[1], num=1000)
    a = start_y
    c = 0
    y_values = a * np.exp(b * x_values) + c
    y_range = end_y - start_y
    def exponential_interpolator(x):
        nonlocal a, b, c, y_range
        t = (x - x_range[0]) / (x_range[1] - x_range[0])
        y = a + y_range * (np.exp(b * (t * (x_range[1] - x_range[0])))-1) / (np.exp(b * (x_range[1] - x_range[0])) - 1)
        return y
    return exponential_interpolator

