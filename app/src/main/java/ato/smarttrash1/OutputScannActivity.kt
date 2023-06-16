package ato.smarttrash1

import android.Manifest
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.provider.MediaStore
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import ato.smarttrash1.databinding.ActivityOutputScannBinding
import android.content.pm.PackageManager
import androidx.fragment.app.FragmentManager
import java.io.File

class OutputScannActivity : AppCompatActivity() {
    private lateinit var binding: ActivityOutputScannBinding
    private lateinit var currentPhotoPath: String
    private lateinit var fragmentManager: FragmentManager


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOutputScannBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnTambah.setOnClickListener {
            val post = Intent(this@OutputScannActivity, TotalActivity::class.java)
            startActivity(post)
            finish()
        }
        binding.btnTakePhoto2.setOnClickListener { startTakePhoto() }
    }


    private fun startTakePhoto() {
        val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        intent.resolveActivity(packageManager)

        createCustomTempFile(application).also {
            val photoURI: Uri = FileProvider.getUriForFile(
                this@OutputScannActivity,
                "ato.smarttrash1",
                it
            )
            currentPhotoPath = it.absolutePath
            intent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
            launcherIntentCamera.launch(intent)
        }
    }

    private var getFile: File? = null
    private val launcherIntentCamera = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) {
        if (it.resultCode == RESULT_OK) {
            val myFile = File(currentPhotoPath)
            getFile = myFile

            val result = BitmapFactory.decodeFile(getFile?.path)
            binding.imPreview2.setImageBitmap(result)
        }
    }
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
    companion object {
        const val CAMERA_X_RESULT2 = 200

        private val REQUIRED_PERMISSIONS2 = arrayOf(Manifest.permission.CAMERA)
        private const val REQUEST_CODE_PERMISSIONS2 = 10
    }
}