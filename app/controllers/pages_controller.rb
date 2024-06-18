class PagesController < ApplicationController
  def home
  end

  def about
  end

  def contact
  end

  def upload_audio
    Rails.logger.debug "Params: #{params.inspect}"
    audio = params[:audio]
    Rails.logger.debug "Audio Params: #{audio.inspect}"

    if audio.present?
      file_path = Rails.root.join('public', 'uploads', audio.original_filename)
      Rails.logger.debug "Saving to: #{file_path}"

      File.open(file_path, 'wb') do |file|
        file.write(audio.read)
      end

      Rails.logger.debug "File saved successfully."
      head :ok
    else
      Rails.logger.error "Audio file not found in params."
      head :unprocessable_entity
    end
  rescue => e
    Rails.logger.error "Failed to upload audio: #{e.message}"
    head :unprocessable_entity
  end
end
