package ato.smarttrash1

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import ato.smarttrash1.databinding.ActivitySignUpBinding

class SignUpActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignUpBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignUpBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.btnSignup.setOnClickListener {
            val intent = Intent(this, SignInActivity::class.java )
            startActivity(intent)
        }
        binding.tvSignin.setOnClickListener {
            startActivity(Intent(this, SignInActivity::class.java))
        }
    }
}