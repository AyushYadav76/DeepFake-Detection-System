import tensorflow as tf

print("TensorFlow:", tf.__version__)

# Create a simple tensor
a = tf.constant([[1.0, 2.0], [3.0, 4.0]])
b = tf.constant([[5.0, 6.0], [7.0, 8.0]])

result = tf.matmul(a, b)

print("\nMatrix multiplication:")
print(result.numpy())

print("\nExecution device:", result.device)
print("\nTensorFlow CPU test successful!")