package ato.smarttrash1

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import ato.smarttrash1.databinding.ActivitySignInBinding
import ato.smarttrash1.ui.home.HomeFragment

class SignInActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignInBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignInBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.btnSignin.setOnClickListener {
            val intent = Intent(this, HomeActivity::class.java )
            startActivity(intent)
        }
        binding.tvSignup.setOnClickListener {
            startActivity(Intent(this@SignInActivity, SignUpActivity::class.java))
        }
    }
}